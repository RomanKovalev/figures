import graphene
from graphene_django import DjangoObjectType
import channels_graphql_ws
from api.models import Figure

CHATROOM = "figures"

class FigureType(DjangoObjectType):
  class Meta:
    model = Figure
    fields = '__all__'

class FiguresQuery(graphene.ObjectType):
  figures = graphene.List(FigureType)

  def resolve_figures(self, info, **kwargs):
    return Figure.objects.all()

class CreateFigure(graphene.Mutation):
  figure = graphene.Field(FigureType)
  class Arguments:
    top = graphene.Int(required=True)
    left = graphene.Int(required=True)
    width = graphene.Int(required=True)
    height = graphene.Int(required=True)
    draggable = graphene.Boolean(required=True)
    offsetx = graphene.Int(required=True)
    offsety = graphene.Int(required=True)
    chatroom = graphene.String(required=True)
  @staticmethod
  def mutate(self, info, top, left, width, height, draggable, offsetx, offsety, chatroom):
    figure = Figure(
      left=left,
      top=top,
      width = width,
      height = height,
      draggable = draggable,
      offsetx = offsetx,
      offsety = offsety
    )
    figure.save()
    OnNewChatMessage.new_chat_message(OnNewChatMessage, figure=figure)
    return CreateFigure(figure=figure)


class UpdateFigure(graphene.Mutation):
  figure = graphene.Field(FigureType)
  ok = graphene.Boolean()
  class Arguments:
    pk = graphene.Int(required=True)
    top = graphene.Int()
    left = graphene.Int()
    width = graphene.Int()
    height = graphene.Int()
    draggable = graphene.Boolean()
    offsetx = graphene.Int()
    offsety = graphene.Int()

  def mutate(self, info, pk, **kwargs):
    figure = Figure.objects.filter(pk=pk)
    figure.update(**kwargs)
    return UpdateFigure(ok=True, figure=figure)


class DeleteFigures(graphene.Mutation):
  ok = graphene.Boolean()

  def mutate(self, info):
    Figure.objects.all().delete()
    return UpdateFigure(ok=True)


class OnNewChatMessage(channels_graphql_ws.Subscription):
  chatroom = graphene.String()
  figure = graphene.Field(FigureType)

  def subscribe(self, info, chatroom=CHATROOM):
    del info
    return [chatroom] if chatroom is not None else None

  def publish(self, info):
    new_figure = self["figure"]
    return OnNewChatMessage(figure=new_figure, chatroom=CHATROOM)

  def new_chat_message(cls, figure):
    cls.broadcast(group=CHATROOM, payload={"figure": figure})

class Subscription(graphene.ObjectType):
  on_new_chat_message = OnNewChatMessage.Field()

class FigureMutation(graphene.ObjectType):
  addFigure = CreateFigure.Field()
  updateFigure = UpdateFigure.Field()
  deleteFigures = DeleteFigures.Field()


schema = graphene.Schema(query=FiguresQuery, mutation=FigureMutation, subscription=Subscription)


class MyGraphqlWsConsumer(channels_graphql_ws.GraphqlWsConsumer):
  schema = schema

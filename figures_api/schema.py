import graphene
from graphene_django import DjangoObjectType

from api.models import Figure

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

  def mutate(self, info, top, left, width, height, draggable, offsetx, offsety):
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


class FigureMutation(graphene.ObjectType):
  addFigure = CreateFigure.Field()
  updateFigure = UpdateFigure.Field()
  deleteFigures = DeleteFigures.Field()


schema = graphene.Schema(query=FiguresQuery, mutation=FigureMutation)

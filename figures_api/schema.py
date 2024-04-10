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

class FigureMutation(graphene.ObjectType):
  addFigure = CreateFigure.Field()
  # update_figure = graphene.Field(FigureType)


schema = graphene.Schema(query=FiguresQuery, mutation=FigureMutation)

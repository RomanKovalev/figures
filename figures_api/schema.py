import graphene
from graphene_django import DjangoObjectType

from api.models import Figure

class FigureType(DjangoObjectType):
  class Meta:
    model = Figure
    fields = '__all__'

class Query(graphene.ObjectType):
  figures = graphene.List(FigureType)

  def resolve_figures(self, info, **kwargs):
    return Figure.objects.all()
  # def resolve_users(self, info, **kwargs):
  #   return User.objects.all()

schema = graphene.Schema(query=Query)
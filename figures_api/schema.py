import graphene
from graphene_django import DjangoObjectType

from django.contrib.auth import get_user_model

User = get_user_model()


class UserType(DjangoObjectType):
  class Meta:
    model = User
    fields = ("id", "username", "email", "first_name", "last_name")


class Query(graphene.ObjectType):
  users = graphene.List(UserType)

  def resolve_users(self, info, **kwargs):
    return User.objects.all()

schema = graphene.Schema(query=Query)
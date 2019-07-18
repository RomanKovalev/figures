from rest_framework.serializers import ModelSerializer


from .models import Figure

class FigureSerializer(ModelSerializer):

    class Meta:
        model = Figure
        fields = '__all__'
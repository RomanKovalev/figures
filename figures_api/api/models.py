from django.db import models

class Figure(models.Model):
    top = models.IntegerField()
    left = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    offsetx = models.IntegerField(default=0)
    offsety = models.IntegerField(default=0)
    draggable = models.BooleanField(default=True)

    def __str__(self):
        return str(self.id)
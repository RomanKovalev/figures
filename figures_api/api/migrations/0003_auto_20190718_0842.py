# Generated by Django 2.2.3 on 2019-07-18 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_figure_draggable'),
    ]

    operations = [
        migrations.AddField(
            model_name='figure',
            name='offsetx',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='figure',
            name='offsety',
            field=models.IntegerField(default=0),
        ),
    ]

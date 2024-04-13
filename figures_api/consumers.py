import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class FiguresConsumer(WebsocketConsumer):
    def connect(self):
        print('FiguresConsumer.connect fired')
        self.room_group_name = "FIGURES"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        print('FiguresConsumer.disconnect fired, close code:', close_code)
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        print('FiguresConsumer.receive fired')
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        # self.send(text_data=json.dumps({"message": message}))
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "pipeline.message", "message": message}
        )

    # Receive message from room group
    def pipeline_message(self, event):
        message = event["message"]
        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))
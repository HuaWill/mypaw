import 'package:flutter/material.dart';

class SinglePic extends StatelessWidget {

  final itemInfo;

  SinglePic(this.itemInfo);

  @override
  Widget build(BuildContext context) {
    String imageUrl = this.itemInfo['data']['imageList'][0];

    return new Row(
      children: [
        new Expanded(
          flex: 2,
          child: new Text(this.itemInfo['data']['title'])
        ),
        new Expanded(
          flex: 1,
          child: new Image(
            image: new NetworkImage(imageUrl)
          )
        )
      ]
    );
  }
}
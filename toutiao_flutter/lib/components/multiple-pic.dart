import 'package:flutter/material.dart';
import 'package:toutiao_flutter/pages/detail.dart';

class MultiplePic extends StatelessWidget {

  final itemInfo;

  MultiplePic(this.itemInfo);

  @override
  Widget build(BuildContext context) {

    List images = this.itemInfo['data']['imageList'];
    List<Widget> imageList = images.map((imageUrl) {
      return new Expanded(
        flex: 1,
        child: new Image(
          image: new NetworkImage(imageUrl)
        )
      );
    }).toList();

    return new GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => new DetailPage(this.itemInfo))
        );
      },
      child: new Column(
        children: [
          new Padding(
            padding: EdgeInsets.fromLTRB(0, 0, 0, 6),
            child: new Align(
              alignment: Alignment.centerLeft,
              child: Text(this.itemInfo['data']['title'])
            )
          ),
          new Row(
            children: imageList
          )
      ]
      )
    );
  }
}
import 'package:flutter/material.dart';

class DetailPage extends StatelessWidget {

  final detail;

  DetailPage(this.detail);

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text('详情页')
        ),
        body: Padding(
          padding: EdgeInsets.all(10),
          child: new Text(this.detail['data']['title'])
        )
    );
  }
}

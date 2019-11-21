import 'package:flutter/material.dart';
import 'list.dart' show ContentListStateful;

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'toutiao flutter',
      debugShowCheckedModeBanner: false,
      home: new Scaffold(
        appBar: new AppBar(
          title: new Text('我是头条糕')
        ),
        body: new Center(
          child: Padding(
            padding: EdgeInsets.all(10),
            child: new ContentListStateful(),
          )
        )
      )
    );
  }
}

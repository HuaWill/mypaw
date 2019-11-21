import 'package:flutter/material.dart';

class DefaultItem extends StatelessWidget {
  
  final itemInfo;

  DefaultItem(this.itemInfo);

  @override
  Widget build(BuildContext context) {
    return new Text('我是默认项');
  }
}
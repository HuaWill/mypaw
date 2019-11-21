import 'package:flutter/widgets.dart';
import './multiple-pic.dart';
import './single-pic.dart';
import './default.dart';

class ComponentsCenter {

  Widget getMultiple(itemInfo) {
    return new Padding(
      padding: EdgeInsets.fromLTRB(0, 0, 0, 10),
      child: MultiplePic(itemInfo)
    );
  }

  Widget getSingle(itemInfo) {
    return new Padding(
      padding: EdgeInsets.fromLTRB(0, 0, 0, 10),
      child: SinglePic(itemInfo)
    );
  }

  Widget getDefault(itemInfo) {
    return new DefaultItem(itemInfo);
  }
}

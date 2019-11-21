import 'dart:async';
import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:toutiao_flutter/components/gesture.dart';

import '../components/components.dart' show ComponentsCenter;

Future<String> loadJSON(BuildContext context) async {
  return await DefaultAssetBundle.of(context).loadString('mock/list.json');
}

HttpClient httpClient = new HttpClient();

Future<dynamic> requestData() async {
  HttpClientRequest request = await httpClient.getUrl(Uri.parse('http://localhost:9000/list'));
  HttpClientResponse response = await request.close();

  if (response.statusCode == 200) {
    var res = await response.transform(utf8.decoder).join();
    return json.decode(res);
  }

  return null;
}

class ContentList extends State<ContentListStateful> {

  ComponentsCenter componentsCenter = new ComponentsCenter();

  bool _requesting = false;

  List data = [];

  @override
  Widget build(BuildContext context) {
    return new FutureBuilder(
      future: loadJSON(context),
      builder: (context, snapshot) {
        if (this.data.length == 0 && snapshot.hasData) {
          this.data = json.decode(snapshot.data.toString())['data'];
        }
        return _getList(this.data, context);
      }
    );
  }

  Widget _getList(listData, context) {
    // return new RawGestureDetector(
      // gestures: {
      //   AllowMultipleGestureRecognizer: GestureRecognizerFactoryWithHandlers<AllowMultipleGestureRecognizer>(
      //     () => AllowMultipleGestureRecognizer(),
      //     (instance) {
      //       instance.onTap = () {
      //         print('tap-outer');
      //       };
      //     }
      //   )
      // },
    return new GestureDetector(
      // onTap: () {

      // },
      child: new NotificationListener(
        onNotification: (ScrollNotification notification) {
          if (notification.metrics.extentAfter < 50 && _requesting != true) {
            _requesting = true;
            new Timer(
              new Duration(seconds: 2),
              () {
                _requesting = false;
                requestData().then((newData) => {
                  if (newData != null) {
                    setState(() {
                      print(this.data.length);
                      this.data.addAll(newData['data']);
                    })
                  }
                });
              }
            );
          }
        },

        child: new ListView.builder(
          itemBuilder: (context, i) {
            if (i < listData.length) {
              var itemInfo = listData[i];
              return _getItem(itemInfo);
            }
            return null;
          }
        )
      )
    );
  }

  Widget _getItem(itemInfo) {
    switch (itemInfo['type']) {
      case 'multiplePic':
        return componentsCenter.getMultiple(itemInfo);
      case 'singlePic':
        return componentsCenter.getSingle(itemInfo);
      default:
        return componentsCenter.getDefault(itemInfo);
    }
  }
}

class ContentListStateful extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return new ContentList();
  }
}

# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'PlaybackWidget.ui'
#
# Created: Sat Feb  2 16:30:20 2013
#      by: pyside-uic 0.2.13 running on PySide 1.1.0
#
# WARNING! All changes made in this file will be lost!

from PySide import QtCore, QtGui

class Ui_PlaybackWidget(object):
    def setupUi(self, PlaybackWidget):
        PlaybackWidget.setObjectName("PlaybackWidget")
        PlaybackWidget.resize(877, 412)
        self.webView = QtWebKit.QWebView(PlaybackWidget)
        self.webView.setGeometry(QtCore.QRect(0, 0, 881, 411))
        self.webView.setUrl(QtCore.QUrl("about:blank"))
        self.webView.setObjectName("webView")

        self.retranslateUi(PlaybackWidget)
        QtCore.QMetaObject.connectSlotsByName(PlaybackWidget)

    def retranslateUi(self, PlaybackWidget):
        PlaybackWidget.setWindowTitle(QtGui.QApplication.translate("PlaybackWidget", "PyWebNCL", None, QtGui.QApplication.UnicodeUTF8))

from PySide import QtWebKit

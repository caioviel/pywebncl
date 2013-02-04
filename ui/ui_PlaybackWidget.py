# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'PlaybackWidget.ui'
#
# Created: Mon Feb  4 11:00:46 2013
#      by: PyQt4 UI code generator 4.9.1
#
# WARNING! All changes made in this file will be lost!

from PyQt4 import QtCore, QtGui

try:
    _fromUtf8 = QtCore.QString.fromUtf8
except AttributeError:
    _fromUtf8 = lambda s: s

class Ui_PlaybackWidget(object):
    def setupUi(self, PlaybackWidget):
        PlaybackWidget.setObjectName(_fromUtf8("PlaybackWidget"))
        PlaybackWidget.resize(877, 412)
        self.webView = QtWebKit.QWebView(PlaybackWidget)
        self.webView.setGeometry(QtCore.QRect(0, 0, 881, 411))
        self.webView.setUrl(QtCore.QUrl(_fromUtf8("about:blank")))
        self.webView.setObjectName(_fromUtf8("webView"))

        self.retranslateUi(PlaybackWidget)
        QtCore.QMetaObject.connectSlotsByName(PlaybackWidget)

    def retranslateUi(self, PlaybackWidget):
        PlaybackWidget.setWindowTitle(QtGui.QApplication.translate("PlaybackWidget", "PyWebNCL", None, QtGui.QApplication.UnicodeUTF8))

from PyQt4 import QtWebKit

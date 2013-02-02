# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'ChooseDocumentWidget.ui'
#
# Created: Sat Feb  2 16:30:20 2013
#      by: pyside-uic 0.2.13 running on PySide 1.1.0
#
# WARNING! All changes made in this file will be lost!

from PySide import QtCore, QtGui

class Ui_ChooseDocumentWidget(object):
    def setupUi(self, ChooseDocumentWidget):
        ChooseDocumentWidget.setObjectName("ChooseDocumentWidget")
        ChooseDocumentWidget.resize(484, 128)
        self.btn_choose_file = QtGui.QPushButton(ChooseDocumentWidget)
        self.btn_choose_file.setGeometry(QtCore.QRect(430, 10, 41, 27))
        self.btn_choose_file.setText("")
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap(":/i/folder_open.png"), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.btn_choose_file.setIcon(icon)
        self.btn_choose_file.setIconSize(QtCore.QSize(25, 25))
        self.btn_choose_file.setObjectName("btn_choose_file")
        self.txt_document_name = QtGui.QTextEdit(ChooseDocumentWidget)
        self.txt_document_name.setGeometry(QtCore.QRect(10, 10, 411, 31))
        self.txt_document_name.setTextInteractionFlags(QtCore.Qt.TextSelectableByKeyboard|QtCore.Qt.TextSelectableByMouse)
        self.txt_document_name.setObjectName("txt_document_name")
        self.ckb_remote_control = QtGui.QCheckBox(ChooseDocumentWidget)
        self.ckb_remote_control.setGeometry(QtCore.QRect(10, 60, 151, 22))
        self.ckb_remote_control.setObjectName("ckb_remote_control")
        self.lbl_size = QtGui.QLabel(ChooseDocumentWidget)
        self.lbl_size.setGeometry(QtCore.QRect(260, 60, 66, 17))
        self.lbl_size.setObjectName("lbl_size")
        self.cmb_size = QtGui.QComboBox(ChooseDocumentWidget)
        self.cmb_size.setGeometry(QtCore.QRect(330, 50, 141, 31))
        self.cmb_size.setEditable(True)
        self.cmb_size.setObjectName("cmb_size")
        self.cmb_size.addItem("")
        self.cmb_size.addItem("")
        self.cmb_size.addItem("")
        self.cmb_size.addItem("")
        self.cmb_size.addItem("")
        self.cmb_size.addItem("")
        self.btn_start = QtGui.QPushButton(ChooseDocumentWidget)
        self.btn_start.setGeometry(QtCore.QRect(287, 90, 181, 31))
        icon1 = QtGui.QIcon()
        icon1.addPixmap(QtGui.QPixmap(":/i/button_blue_play.png"), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.btn_start.setIcon(icon1)
        self.btn_start.setIconSize(QtCore.QSize(25, 25))
        self.btn_start.setObjectName("btn_start")

        self.retranslateUi(ChooseDocumentWidget)
        QtCore.QMetaObject.connectSlotsByName(ChooseDocumentWidget)

    def retranslateUi(self, ChooseDocumentWidget):
        ChooseDocumentWidget.setWindowTitle(QtGui.QApplication.translate("ChooseDocumentWidget", "PyWebNCL - Selecionando a Apresentação NCL", None, QtGui.QApplication.UnicodeUTF8))
        self.ckb_remote_control.setText(QtGui.QApplication.translate("ChooseDocumentWidget", "Controle Remoto", None, QtGui.QApplication.UnicodeUTF8))
        self.lbl_size.setText(QtGui.QApplication.translate("ChooseDocumentWidget", "Tamanho:", None, QtGui.QApplication.UnicodeUTF8))
        self.cmb_size.setItemText(0, QtGui.QApplication.translate("ChooseDocumentWidget", "400x300", None, QtGui.QApplication.UnicodeUTF8))
        self.cmb_size.setItemText(1, QtGui.QApplication.translate("ChooseDocumentWidget", "480x360", None, QtGui.QApplication.UnicodeUTF8))
        self.cmb_size.setItemText(2, QtGui.QApplication.translate("ChooseDocumentWidget", "800x600", None, QtGui.QApplication.UnicodeUTF8))
        self.cmb_size.setItemText(3, QtGui.QApplication.translate("ChooseDocumentWidget", "1024x768", None, QtGui.QApplication.UnicodeUTF8))
        self.cmb_size.setItemText(4, QtGui.QApplication.translate("ChooseDocumentWidget", "1280x720", None, QtGui.QApplication.UnicodeUTF8))
        self.cmb_size.setItemText(5, QtGui.QApplication.translate("ChooseDocumentWidget", "1920x1080", None, QtGui.QApplication.UnicodeUTF8))
        self.btn_start.setText(QtGui.QApplication.translate("ChooseDocumentWidget", "Iniciar Apresentação", None, QtGui.QApplication.UnicodeUTF8))

import icons_rc

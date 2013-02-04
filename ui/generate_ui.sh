#!/bin/bash

RCC=pyrcc4
UIC=pyuic4
#RCC=pyside-rcc
#UIC=pyside-uic

$RCC icons.qrc > icons_rc.py
$UIC ChooseDocumentWidget.ui > ui_ChooseDocumentWidget.py
$UIC PlaybackWidget.ui > ui_PlaybackWidget.py

#!/bin/bash
pyside-rcc icons.qrc > icons_rc.py
pyside-uic PlaybackWidget.ui > ui_PlaybackWidget.py
pyside-uic ChooseDocumentWidget.ui > ui_ChooseDocumentWidget.py

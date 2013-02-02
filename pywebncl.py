#!/usr/bin/env python
# -*- coding: utf-8 -*-

from PySide import QtGui, QtCore
from ui.ui_ChooseDocumentWidget import Ui_ChooseDocumentWidget
from ui.ui_PlaybackWidget import Ui_PlaybackWidget
import os
import shutil

class PlaybackWidget(QtGui.QWidget):
    def __init__(self, width, height, directory, filename, parent=None):
        super(PlaybackWidget, self).__init__(parent) 
        self.__width, self.__height = width, height
        self.directory = directory
        self.filename = filename
        
        self.ui = Ui_PlaybackWidget()
        self.ui.setupUi(self)
        
        self.init_ui()
        self.show()
        
        self.generate_temp_files()
        self.start_presentation()
        
    def init_ui(self):
        self.resize(self.__width, self.__height)
        self.ui.webView.resize(self.__width, self.__height)
        self.move(0,0)
        self.setMaximumSize(self.size())
    
    def generate_temp_files(self):
        shutil.rmtree(self.directory + '/.webncl', True)
        shutil.copytree('webncl', self.directory + '/.webncl')
        self.generate_html_file(self.directory + '/.webncl/index.html')
        
        
    def generate_html_file(self, filename):
        content = \
                '<html>\n\
                    <head>\n\
                        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />\n\
                        <link rel="stylesheet" type="text/css" href="css/webncl.css" />\n\
                        <script type="text/javascript" src="js/amq_jquery_adapter.js"></script>\n\
                        <script type="text/javascript" src="js/amq.js"></script>\n\
                        <script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>\n\
                        <script type="text/javascript" src="js/popcorn.js"></script>\n\
                        <script type="text/javascript" src="js/lua+parser.min.js"></script>\n\
                        <script type="text/javascript" src="js/webncl.js"></script>\n\
                    </head>\n\
                    <body>\n\
                        <div id="myPlayerDiv" style="position:relative;width:%dpx;height:%dpx"></div>\n\
                        <script type="text/javascript" >\n\
                            myPlayer = new WebNclPlayer("%s","myPlayerDiv");\n\
                        </script>\n\
                    </body>\n\
                </html>' % (self.__width, self.__height, os.path.join(self.directory, self.filename))
        
        html_file = open(filename, 'w+')
        html_file.write(content)
        html_file.close()

        
    
    def start_presentation(self):
        webView = self.ui.webView
        settings = webView.settings()
        settings.setAttribute(settings.LocalContentCanAccessRemoteUrls, True)
        settings.setAttribute(settings.LocalContentCanAccessFileUrls, True)
        #webView.loadFinished.connect(self.page_loaded)
        webView.setUrl(self.directory + '/.webncl/index.html')
    
    #def close(self):
    #    
        

class ChooseDocumentWidget(QtGui.QWidget):
    
    def __init__(self, parent=None):
        super(ChooseDocumentWidget, self).__init__(parent)
        self.ui = Ui_ChooseDocumentWidget()
        self.home_directory =  os.getenv('USERPROFILE') or os.getenv('HOME')
        
        self.ui.setupUi(self)
        self.ui.btn_choose_file.clicked.connect(self.choose_document)
        self.ui.btn_start.clicked.connect(self.start_presentation)
        self.ui.btn_start.setEnabled(False)
        self.show()
        
    
    @QtCore.Slot()
    def choose_document(self):
        filepath, _ = QtGui.QFileDialog.getOpenFileName(self, 
                                                    u'Selecione o Documento NCL',
                                                    self.home_directory,
                                                    'Documento NCL (*.ncl)')
        
        if not filepath:
            self.ui.btn_start.setEnabled(False)
            self.ui.txt_document_name.setText('')
        else:
            self.directory, self.filename = os.path.split(filepath)
            self.ui.txt_document_name.setText(filepath)
            self.ui.btn_start.setEnabled(True)
        
    
    @QtCore.Slot()
    def start_presentation(self):
        size_str = self.ui.cmb_size.currentText()
        width, height = 0, 0
        try:
            width, height = size_str.split('x')
            width = int(width)
            height = int(height)
        except:
            QtGui.QMessageBox.warning(self, u'Informações Inválidas',
                                      u'O tamanho especificado é invalido.',
                                      QtGui.QMessageBox.Ok)
            self.ui.cmb_size.setCurrentIndex(0)
            return
        
        use_control = self.ui.ckb_remote_control.checkState() == QtCore.Qt.Checked
        
        self.playback = PlaybackWidget(width, height, self.directory, self.filename)
        #self.playback.activateWindow()
        
        if use_control:
            pass
            #create and initialize control
            
        self.setVisible(False)

def test():
    import sys
    app = QtGui.QApplication(sys.argv)
    widget = ChooseDocumentWidget()
    sys.exit(app.exec_())
 
    
if __name__ == "__main__":
    test()
import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import DropZoneModal from './drop'

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openUploadModal: true,
      files: []
    }
  }

  closeDialog() {
    this.setState({ openUploadModal: false })
  }

  saveFiles(files) {
    //Saving files to state for further use and closing Modal.
    this.setState({ files: files, openUploadModal: false })

    console.log(files)
  }

  handleOpenUpload() {
    this.setState({
      openUploadModal: true
    })
  }

  deleteFile(fileName) {
    this.props.deleteFile(fileName)
  }

  render() {
    //If we already saved files they will be shown again in modal preview.
    let files = this.state.files
    let style = {
      addFileBtn: {
        marginTop: '15px'
      }
    }

    return (
      <div>
        <DropZoneModal
          saveFiles={this.saveFiles.bind(this)}
          deleteFile={this.deleteFile.bind(this)}
          acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
          files={files}
          maxSize={5000000}
          closeDialog={this.closeDialog.bind(this)}
        />
      </div>
    )
  }
}

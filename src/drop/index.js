import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dropzone from "react-dropzone";
import ActionDelete from "@material-ui/icons/Clear";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { isImage } from "./helpers.js";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  ListItemSecondaryAction,
  Divider
} from "@material-ui/core";

const options = [
  "Clique para alterar o tipo de arquivo",
  "Lâmina",
  "Termo",
  "Regulamento",
  "Prospecto",
  "Demonstração de desempenho"
];

export default class MaterialDropZone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      openSnackBar: false,
      errorMessage: "",
      files: this.props.files || [],
      disabled: true,
      acceptedFiles: this.props.acceptedFiles || [
        "image/jpeg",
        "image/png",
        "image/bmp",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ],
      anchorEl: null,
      selects: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      files: nextProps.files
    });
  }

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState(state => ({
      selects: { ...state.selects, [state.anchorEl.dataset.testid]: index },
      anchorEl: null
    }));
  };

  handleClose() {
    this.props.closeDialog();
    this.setState({ open: false });
  }

  onDrop(files) {
    let oldFiles = this.state.files;
    const filesLimit = this.props.filesLimit || "5";

    oldFiles = oldFiles.concat(files);
    if (oldFiles.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        errorMessage: "Cannot upload more then " + filesLimit + " items."
      });
    } else {
      this.setState(
        {
          files: oldFiles
        },
        this.changeButtonDisable
      );
    }
  }

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleRemove(file, fileIndex) {
    const files = this.state.files;
    // This is to prevent memory leaks.
    window.URL.revokeObjectURL(file.preview);

    files.splice(fileIndex, 1);
    this.setState(files, this.changeButtonDisable);

    if (file.path) {
      this.props.deleteFile(file);
    }
  }

  changeButtonDisable() {
    if (this.state.files.length !== 0) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  }

  saveFiles() {
    const filesLimit = this.props.filesLimit || "3";

    if (this.state.files.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        errorMessage: "Cannot upload more then " + filesLimit + " items."
      });
    } else {
      this.props.saveFiles(this.state.files);
    }
  }

  onDropRejected() {
    this.setState({
      openSnackBar: true,
      errorMessage: "File too big, max size is 3MB"
    });
  }

  handleRequestCloseSnackBar = () => {
    this.setState({
      openSnackBar: false
    });
  };

  render() {
    let img;
    let previews = "";
    const fileSizeLimit = this.props.maxSize || 3000000;
    const { anchorEl } = this.state;

    previews = this.state.files.map((file, i) => {
      const path = file.preview || "/pic" + file.path;

      img = <FileIcon className="smallPreviewImg" />;

      return (
        <div>
          <div className={"imageContainer col fileIconImg"} key={i}>
            <ListItem onClick={this.handleClickListItem} data-testid={i}>
              <Avatar>{img}</Avatar>
              <ListItemText
                primary={file.name}
                secondary={options[this.state.selects[i]]}
              />
              <ListItemSecondaryAction>
                <IconButton touch={true}>
                  <ActionDelete
                    className="removeBtn"
                    onTouchTap={this.handleRemove.bind(this, file, i)}
                    onClick={this.handleRemove.bind(this, file, i)}
                  />
                </IconButton>
              </ListItemSecondaryAction>
              <ListItemSecondaryAction>
                <IconButton touch={true}>
                  <ActionDelete
                    className="removeBtn"
                    onTouchTap={this.handleRemove.bind(this, file, i)}
                    onClick={this.handleRemove.bind(this, file, i)}
                  />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        </div>
      );
    });

    return (
      <div>
        <Card>
          <CardHeader id="simple-dialog-title">Upload File</CardHeader>
          <CardContent>
            <Dropzone
              accept={this.state.acceptedFiles.join(",")}
              onDrop={this.onDrop.bind(this)}
              className={"dropZone"}
              acceptClassName={"stripes"}
              rejectClassName={"rejectStripes"}
              onDropRejected={this.onDropRejected.bind(this)}
              maxSize={fileSizeLimit}
            >
              <div className={"dropzoneTextStyle"}>
                <p className={"dropzoneParagraph"}>
                  {"Drag and drop an image file here or click"}
                </p>
                <br />
                <CloudUploadIcon className={"uploadIconSize"} />
              </div>
            </Dropzone>
            <br />
            <div className="row">
              {this.state.files.length ? <span>Arquivos:</span> : ""}
            </div>
            <div className="row">
              <List>{previews}</List>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleCloseMenu}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    disabled={[
                      0,
                      ...Object.values(this.state.selects)
                    ].includes(index)}
                    selected={index === this.state.selectedIndex}
                    onClick={event => this.handleMenuItemClick(event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </CardContent>
          <CardActions>
            <Button
              onTouchTap={this.handleClose.bind(this)}
              onClick={this.handleClose.bind(this)}
            >
              Cancel
            </Button>
            <Button
              disabled={this.state.disabled}
              onTouchTap={this.saveFiles.bind(this)}
              onClick={this.saveFiles.bind(this)}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
        <Snackbar
          open={this.state.openSnackBar}
          message={this.state.errorMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestCloseSnackBar}
        />
      </div>
    );
  }
}

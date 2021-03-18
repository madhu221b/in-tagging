import React from 'react';
import { render } from 'react-dom';
import axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';

const bottomOffset = 73
const leftOffset = 20

let bottom = 750*0.11770063638687134 - 70
let left = 1000*0.24561920762062073 - 12
let w = 1000*0.2204837203025818
let h = 750*0.45420312881469727

const classes = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

 const showModal = () => {
    this.setState({isModalVisible:true})

  };

//  const handleOk = () => {
//      this.setState({isModalVisible:false})
//  };
//
//  const handleCancel = () => {
//     this.setState({isModalVisible:false})
//  };

class GalleryImages extends React.Component {


  constructor(props){
  super(props)
  this.state = {image:null, imageArray : null,
  loading: false,isModalVisible:false, showModalContent:null}

  }

  componentDidMount()
  {
     this.setState({loading:true}, () => {axios.get('http://127.0.0.1:5000/')
       .then((response) => {
//         let data = response.data.ImageBytes
//         this.setState({image:"data:image/png;base64," + data})
         let imgArray = response.data
         console.log(imgArray)
         this.setState({imageArray:imgArray,loading:false})
         console.log(response.data);
         console.log(response.status);
         console.log(response.statusText);
         console.log(response.headers);
         console.log(response.config);
       });
       });
  }

  onHideShow = (id) => {
  // console.log("In here", id)
     let x = document.getElementById(id);
     console.log("In onhideshow function",id)
     console.log(x)
     if(x.style.display === "block")
     {
         console.log("I am blocked")
         document.getElementById(x).style.border = "none"
         }
//     if (x.style.display === "none") {
//          x.style.display = "block";
//       } else {
//         x.style.display = "none";
//     }
  }

 openModal = (id, src, dim_array) => {


   let imgWidth = dim_array[0].imgSize[0] + "px"
   let imgHeight = dim_array[0].imgSize[1] + "px"
   let image = <img id={id} src={src} style={{width:{imgWidth},height:{imgHeight}}}/>
   let arr = []
   if(dim_array){
     dim_array.map((dim,i) =>
     {
      let div_id = id + i
      console.log(dim, imgWidth, dim.rect , dim.rect[0], dim.rect[0][1])
      let img_width = dim.imgSize[0]
      let img_height = dim.imgSize[1]
      let bottom = img_height*dim.rect[0][1] + bottomOffset
      let left = img_width*dim.rect[0][0] + leftOffset
      let w = img_width*dim.rect[1][0]
      let h =  img_height*dim.rect[1][1]
      let color = "#FF00FF"
      let class_ = dim.className
      let barcode_div = <div></div>
      if(class_=="box")
          color = "#FF00FF"
      else if(class_=="barcode")
          color = "#FFFF00"
      console.log(bottom, left, w , h , arr)
      if(class_=="barcode")
      {
        console.log(dim.code)
         let bottom_pos = bottom - 5
         let left_pos = left - 5
         barcode_div = <div style={{position:"absolute",bottom:bottom_pos+"px",
         left:left_pos+"px", width:"justify-content" , height:"10px", backgroundColor:"green", fontColor:"black",
          fontSize:"10px"}}>{dim.code}</div>
      }
      {console.log(div_id)}
      arr.push(<div><div id={div_id} onClick={()=>this.onHideShow(div_id)} style={{position:"absolute",bottom:bottom+"px", left:left+"px",
       width:w+"px",height:h+"px",border:"2px solid "+ color}}/>{barcode_div}</div>)
     })


   }

   let modalContent = (<div> {image} {arr} </div>)

   this.setState({isModalVisible:true,showModalContent:modalContent})
  };

    handleOk = () => {
       this.setState({isModalVisible:false})
   };

    handleCancel = () => {
      this.setState({isModalVisible:false})
   };

  onCreateGallery = () =>
  {
     let arr = []
  if(this.state.imageArray){
   this.state.imageArray.map((image,i) => {
   let img_src = "data:image/png;base64,"+image.ImageBytes
   let img_id = image.id
   let dim_array = image.data
    arr.push(
    <Grid item xs={2}>
      <Paper className={classes.paper} onClick={()=> this.openModal(img_id, img_src, dim_array)}><img id={img_id} src={img_src}
      style={{width:"60px",height:"40px"}}/></Paper>
    </Grid>
    )
   })
   }
//     this.state.imageArray.map(image =>
//     {
//      let boxes = []
//      let dim_array = image.data
//      {console.log(dim_array)}
//      arr.push(
//      <Grid item xs={3}>
//      <Paper className={classes.paper}>Yes</Paper>
//      </Grid>
//      );
//     })
//     arr = <Grid item xs={3}>
//                         <Paper className={classes.paper}>Yes</Paper>
//                       </Grid>;
     return (<div className={classes.root}>
          <Grid container
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                  >
             {arr}
          </Grid>
        </div>);

  }



  render() {

    return(
//    <div>
//    <img id="ItemPreview" src={this.state.image} style={{width:"1000px",height:"750px"}}/>
//    <div id="button" style={{position:"absolute",bottom:bottom+"px", left:left+"px",
//    width:w+"px",height:h+"px",border:"3px solid #FF00FF"}}/>
//    </div>
      <div>
     {this.state.loading? <div>"Data is loading"</div>:<div>{this.onCreateGallery()}</div>}
       <Modal width="800" title="Basic Modal" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
             {this.state.showModalContent}
           </Modal>
     </div>
);
  }
}

export default GalleryImages;
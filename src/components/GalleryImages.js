import React from 'react';
import { render } from 'react-dom';
import axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';
import {Table} from 'antd';

const bottomOffset = 73
const leftOffset = 20

let bottom = 750*0.11770063638687134 - 70
let left = 1000*0.24561920762062073 - 12
let w = 1000*0.2204837203025818
let h = 750*0.45420312881469727

const columns = [
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
  }
];

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

  onHideShow = (id, class_) => {
     console.log(id, class_)
     let x = document.getElementById(id)
     if(class_=="box"){
      if (x.style.border=== "none") {
         x.style.border= "2px solid magenta";
       } else {
         x.style.border= "none";
       }
   }
    else if(class_=="barcode"){
        if (x.style.border=== "none") {
                 x.style.border= "2px solid yellow";
               } else {
                 x.style.border= "none";
               }
    }
  }

 openModal = (id, src, dim_array) => {


   let imgWidth = dim_array[0].imgSize[0] + "px"
   let imgHeight = dim_array[0].imgSize[1] + "px"
   let image = <img id={id} src={src} style={{width:{imgWidth},height:{imgHeight}}}/>
   let arr = []
   let counter = {}
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
          color = "magenta"
      else if(class_=="barcode")
          color = "yellow"
      console.log(bottom, left, w , h , arr)
      if(class_=="barcode")
      {


         let bottom_pos = bottom - 5
         let left_pos = left - 5
         let code = dim.code
         barcode_div = <div style={{position:"absolute",bottom:bottom_pos+"px",
         left:left_pos+"px", width:"justify-content" , height:"10px", backgroundColor:"green", fontColor:"black",
          fontSize:"10px"}}>{code}</div>
          if(code !== "NA"){
          if(counter.hasOwnProperty(code))
          counter[code] += 1
          else
          counter[code] = 1
      }
      }
    if(class_==="barcode")
      arr.push(<div><div id={div_id} onClick={()=>this.onHideShow(div_id, class_)} style={{position:"absolute",bottom:bottom+"px", left:left+"px",
       width:w+"px",height:h+"px",zIndex: 1,border:"2px solid "+ color}}/>{barcode_div}</div>)
       else
       arr.push(<div><div id={div_id} onClick={()=>this.onHideShow(div_id, class_)} style={{position:"absolute",bottom:bottom+"px", left:left+"px",
              width:w+"px",height:h+"px",border:"2px solid "+ color}}/></div>)

     })


   }
   let counter_array = []
      for(let item in counter){
      let row =
      {
      "code": item,
      "count":counter[item]
      }
      counter_array.push(row)
   }


//    for (let item in counter) {
//      console.log('key:' + item + ' value:' + counter[item]);
//      if(item != "NA"){
//      rows.push(<tr>
//       <td>{item}</td>
//       <td>{counter[item]}</td>
//      </tr>)
//    }
//    }
    let table = <Table dataSource={counter_array} columns={columns} />
   let modalContent = (
   <table> <tr>
    <td>
   <div>
   {image}
    {arr}
     </div>
     </td>
     <td>
     {table}
     </td>
     </tr></table>)

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

  generateView = () => {


    let counter = {}
    if(this.state.imageArray){
  this.state.imageArray.map(image => {

     image.data.map(dim => {
          if(dim.className == "barcode"){
         let code = dim.code
         console.log("Code", code)
           if(code !== "NA"){
            console.log("Code in if clause", code)
               if(counter.hasOwnProperty(code))
               counter[code] += 1
               else
               counter[code] = 1
               }
        }

     })



  })
 }
  let counter_array = []
        for(let item in counter){
        let row =
        {
        "code": item,
        "count":counter[item]
        }
        counter_array.push(row)
     }
  return <Table dataSource={counter_array} columns={columns} />
  }

  render() {

    return(
//    <div>
//    <img id="ItemPreview" src={this.state.image} style={{width:"1000px",height:"750px"}}/>
//    <div id="button" style={{position:"absolute",bottom:bottom+"px", left:left+"px",
//    width:w+"px",height:h+"px",border:"3px solid #FF00FF"}}/>
//    </div>
      <div>
     {this.state.loading? <div>"Data is loading"</div>:
     <div>
     {this.onCreateGallery()}
     {this.generateView()}
     </div>}
       <Modal width="800" title="Basic Modal" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
             {this.state.showModalContent}
           </Modal>
     </div>
);
  }
}

export default GalleryImages;
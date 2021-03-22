import React, { useState, useEffect } from 'react';
import axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';
import {Table} from 'antd';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Chart from "react-apexcharts";

const bottomOffset = 73
const leftOffset = 20
const antIcon = <LoadingOutlined style={{ fontSize: 24}} spin />;
const { Title } = Typography;

let series = [{
              name: 'Barcode Count',
              data: []
            }]

let options = {
              chart: {
                height: 250,
                width: 400,
                type: 'bar',
              },
              plotOptions: {
                bar: {
                  borderRadius: 10,
                  dataLabels: {
                    position: 'top', // top, center, bottom
                  },
                }
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val;
                },
                offsetY: -20,
                style: {
                  fontSize: '10px',
                  colors: ["#304758"]
                }
              },

              xaxis: {
                categories: [],
                position: 'bottom',
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false
                },
                crosshairs: {
                  fill: {
                    type: 'gradient',
                    gradient: {
                      colorFrom: '#D8E3F0',
                      colorTo: '#BED1E6',
                      stops: [0, 100],
                      opacityFrom: 0.4,
                      opacityTo: 0.5,
                    }
                  }
                },
                tooltip: {
                  enabled: true,
                }
              },
              yaxis: {
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false,
                },
                labels: {
                  show: false,
                  formatter: function (val) {
                    return val;
                  }
                }

              },
              title: {
                text: 'Barcode Count',
                floating: true,
                offsetY: 0,
                align: 'top',
                style: {
                  color: '#444'
                }
              }
            }

let seriesPie =  [0, 0]
let optionsPie =    {
                               chart: {
                                 width: 380,
                                 type: 'pie',
                               },
                               labels: ['Box','Barcode'],
                               responsive: [{
                                 breakpoint: 480,
                                 options: {
                                   chart: {
                                     width: 200
                                   },
                                   legend: {
                                     position: 'bottom'
                                   }
                                 }
                               }]
                             }
//let bottom = 750*0.11770063638687134 - 70
//let left = 1000*0.24561920762062073 - 12
//let w = 1000*0.2204837203025818
//let h = 750*0.45420312881469727

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function GalleryImages(){

   const classes = useStyles();
   const [image, setImage] = useState(null);
   const [imageArray, setImageArray] = useState(null)
   const [loading, setLoading] = useState(true)
   const [isModalVisible, setIsModalVisible] = useState(false)
   const [showModalContent, setShowModalContent] = useState(null)
   const [seriesBar, setSeriesBar] = useState(series)
   const [optionsBar, setOptionsBar] = useState(options)

 useEffect(() => {
    axios.get('http://127.0.0.1:5000/')
           .then((response) => {
    //         let data = response.data.ImageBytes
    //         this.setState({image:"data:image/png;base64," + data})
             let imgArray = response.data
             console.log(imgArray)
             // this.setState({imageArray:imgArray,loading:false})
             setImageArray(imgArray)
             setLoading(false)
             console.log(response.data);
             console.log(response.status);
             console.log(response.statusText);
             console.log(response.headers);
             console.log(response.config);
           });
  });

  const onHideShow = (id, class_) => {

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

  const openModal = (id, src, dim_array) => {


   let imgWidth = dim_array[0].imgSize[0] + "px"
   let imgHeight = dim_array[0].imgSize[1] + "px"
   let image = <img id={id} src={src} style={{width:{imgWidth},height:{imgHeight}}}/>
   let arr = []
   let counter = {}
   if(dim_array){
     dim_array.map((dim,i) =>
     {
      let div_id = id + i

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
      arr.push(<div><div id={div_id} onClick={()=>onHideShow(div_id, class_)} style={{position:"absolute",bottom:bottom+"px", left:left+"px",
       width:w+"px",height:h+"px",zIndex: 1,border:"2px solid "+ color}}/>{barcode_div}</div>)
       else
       arr.push(<div><div id={div_id} onClick={()=>onHideShow(div_id, class_)} style={{position:"absolute",bottom:bottom+"px", left:left+"px",
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

   // this.setState({isModalVisible:true,showModalContent:modalContent})
   setIsModalVisible(true)
   setShowModalContent(modalContent)
  };

    const handleOk = () => {
      // this.setState({isModalVisible:false})
      setIsModalVisible(false)
   };

    const handleCancel = () => {
      // this.setState({isModalVisible:false})
      setIsModalVisible(false)
   };

  const onCreateGallery = () =>
  {
     let arr = []
  if(imageArray){
   imageArray.map((image,i) => {
   let img_src = "data:image/png;base64,"+image.ImageBytes
   let img_id = image.id
   let dim_array = image.data

    arr.push(
    <Grid item xs={2}>
      <Paper className={classes.paper} onClick={()=> openModal(img_id, img_src, dim_array)}><img id={img_id} src={img_src}
      style={{width:"100px",height:"80px"}}/></Paper>
    </Grid>
    )
   })
   }

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

  const generateView = () => {


    let counter = {}
    //For pie chart
    seriesPie = [0, 0]
    if(imageArray){
  imageArray.map(image => {

     image.data.map(dim => {
          if(dim.className === "barcode"){
         let code = dim.code
          if(code !== "NA"){
            if(counter.hasOwnProperty(code))
               counter[code] += 1
               else
               counter[code] = 1
               }
               seriesPie[1] += 1
        }
        else if(dim.className === "box" )
          seriesPie[0] += 1


     })



  })
 }
  let counter_array = []

       series[0].data = []
       options.xaxis.categories = []
        for(let item in counter){
        let row =
        {
        "code": item,
        "count":counter[item]
        }
        counter_array.push(row)
        // For summarisation graphs
        series[0].data.push(counter[item])
        options.xaxis.categories.push(item)
     }

  return <Table dataSource={counter_array} columns={columns} />
  }

  const generateGraphs = () => {


  return (
    <div>
      <Chart options={options} series={series} height={400} width={900} type="bar" />
      <Chart options={optionsPie} series={seriesPie} width={380} type="pie" />
    </div>
  );


  }

    return(
//    <div>
//    <img id="ItemPreview" src={this.state.image} style={{width:"1000px",height:"750px"}}/>
//    <div id="button" style={{position:"absolute",bottom:bottom+"px", left:left+"px",
//    width:w+"px",height:h+"px",border:"3px solid #FF00FF"}}/>
//    </div>
      <div>
     {loading?
      <div style={{marginLeft: "50%", marginTop: "20%"}}>
     <Spin indicator={antIcon} />
     </div>:
     <div>
     <Title level={2}>Gather.ai Images Captured by Drone</Title>
     {onCreateGallery()}
     <Title level={2}>Warehouse-level Item Summary View</Title>
     {generateView()}
     <Title level={2}>Summarization Graphs</Title>
     {generateGraphs()}
     </div>}
       <Modal width="800" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
             {showModalContent}
           </Modal>
     </div>
);

}


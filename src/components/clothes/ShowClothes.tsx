import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Delete from '@material-ui/icons/DeleteOutline'
import Pencil from '@material-ui/icons/EditOutlined'
import './clothes.css'
import {Clothes} from '../../types'

// import Typography from '@material-ui/core/Typography';
// import Slider from '@material-ui/core/Slider';
// import Button from '@material-ui/core/Button';

// import {marks} from '../../types'
// import {ChildKeys} from '../../types'
// import APIURL from '../../helpers/environment'

interface ShowClothesProps {
  //   child:ChildKeys
  //   sessionToken:string
  clothes: Clothes[];
}

interface ShowClothesState {

}

export default class ShowClothes extends React.Component<ShowClothesProps, ShowClothesState>{
  constructor(props: ShowClothesProps) {
    super(props)
    this.state = {


    }
  }


  render() {
    return (

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item of clothing</TableCell>
              <TableCell>Temperature range</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        {this.props.clothes?.map((item) => {
          const requiredLow = (item.optionalMin===null)||(item.requiredMin!==null&&item.requiredMin<item.optionalMin);
          const requiredProportion = item.requiredMin&&item.requiredMax?Math.floor(100 * (item.requiredMax - item.requiredMin) / 140):0
          const optionalProportion = item.optionalMin&&item.optionalMax?Math.floor(100 * (item.optionalMax - item.optionalMin) / 140):0
          const unusedLeft = Math.floor(100 * (Math.min((item.requiredMin===null?110:item.requiredMin), (item.optionalMin===null?110:item.optionalMin)) + 30) / 140);
          const unusedRight = Math.floor(100 * (110 - Math.max((item.requiredMax===null?-30:item.requiredMax), (item.optionalMax===null?-30:item.optionalMax))) / 140);
          return (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
              <div className="clothesLine">
                <div className="clothesLineSegment unused" style={{ flex: `${unusedLeft} 0 auto` }}></div>
                <div className={`clothesLineSegment ${requiredLow ? 'required' : 'optional'}`} style={{ flex: `${requiredLow ? requiredProportion : optionalProportion} 0 auto` }}></div>
                <div className={`clothesLineSegment ${requiredLow ? 'optional' : 'required'}`} style={{ flex: `${requiredLow ? optionalProportion : requiredProportion} 0 auto` }}></div>
                <div className="clothesLineSegment unused" style={{ flex: `${unusedRight} 0 auto` }}></div>
              </div>
              </TableCell>
              <TableCell><Pencil/></TableCell>
              <TableCell><Delete/></TableCell>
            </TableRow>
          )
        })}
        </TableBody>
        </Table>
      </TableContainer>
    );

  }
}



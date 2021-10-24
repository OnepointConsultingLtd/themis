import React from 'react';
import { Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

/**
 * Shows skeleton rules manager table (instead of a loading progress bar) while the rules are being loaded 
 * @returns 
 */
export default function SkeletonLoader() {
return <Paper>
              <div style={{ height : '64px', paddingLeft: '24px', paddingRight: '24px', alignItems: 'center', display: 'flex', position: 'relative'}}>
                <h6>Rules Manager</h6>
              </div>
              <table>
                <thead >
                  <tr>
                    <th style={{ width: '20px'}}><Skeleton width={20} variant="rect" width={20} height={20} /></th>
                    <th style={{ width: '900px', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '500', wordBreak: 'normal'}}>Name</th>
                    <th style={{ width: '60px', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '500', wordBreak: 'normal'}}>Servers</th>
                    <th style={{ fontFamily: 'Roboto', fontSize: '14px', fontWeight: '500', wordBreak: 'normal'}}>Tags</th>
                    <th style={{ fontFamily: 'Roboto', fontSize: '14px', fontWeight: '500', wordBreak: 'normal'}}>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map(item => (
                  <tr style={{ height: '64.5px', borderBottom: '1px solid #E0E0E0', verticalAlign: 'middle' }}>
                    <td><Skeleton width={20} variant="rect" width={20} height={20} /></td><td><Skeleton width={900} variant="text" /></td>
                    {[...Array(3)].map(item => (<td><Skeleton width={60} variant="circle" width={40} height={30} /></td>))}
                  </tr>
                  ))}
                </tbody>
            </table>
          </Paper>
}
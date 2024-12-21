import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeletedFilesComponent } from './deleted-files.component';

const routes: Routes = [
  {
    path: 'all',
    component: DeletedFilesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeletedRoutingModule { }
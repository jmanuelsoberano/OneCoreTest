import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from './user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'usuario', 'correo', 'sexo', 'estatus'];
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private service: UserService
  ) {
    this.service.getUsers().subscribe(next => {
      this.dataSource = new MatTableDataSource<User>(next);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit() {    
  }

}

const ELEMENT_DATA: User[] = [
  { id: '1', usuario: 'Hydrogen', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '2', usuario: 'Helium', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '3', usuario: 'Hydrogen', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '4', usuario: 'Helium', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '5', usuario: 'Hydrogen', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '6', usuario: 'Helium', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '7', usuario: 'Hydrogen', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '8', usuario: 'Helium', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '9', usuario: 'Hydrogen', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '10', usuario: 'Helium', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '11', usuario: 'Hydrogen', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '12', usuario: 'Helium', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '13', usuario: 'Hydrogen', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' },
  { id: '14', usuario: 'Helium', correo: 'asdasd@asdasd.com', sexo: 'Masculino', estatus: 'Activo' }
];

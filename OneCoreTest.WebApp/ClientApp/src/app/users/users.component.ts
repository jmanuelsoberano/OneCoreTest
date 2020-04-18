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
  displayedColumns: string[] = ['id', 'usuario', 'correo', 'sexo', 'estatus', 'acciones'];
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private service: UserService
  ) {
    this.getUser();
  }

  ngOnInit() {    
  }

  getUser() {
    this.service.getUsers().subscribe(next => {
      this.dataSource = new MatTableDataSource<User>(next);
      this.dataSource.paginator = this.paginator;
    });
  }

  delete(id: any) {
    if (confirm('Delete this user?')) {
      this.service.deleteUser(id).subscribe(
        () => this.getUser()
      )
    }
  }

  edith(id: any) {
    console.log(id);
  }

}


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedTab = 'allQuestion';

  constructor() { }

  ngOnInit() {
  }

  onTabClick(tabName: string) {
    this.selectedTab = tabName;
  }
}

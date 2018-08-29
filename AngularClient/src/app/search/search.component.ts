import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  search: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe((params: Params) => {
        this.search = params['q'];
      });
  }

  onSearchClick() {
    this.router.navigate(['/questions', 'search'], {
      queryParams: { q: this.search }
    });
  }
}

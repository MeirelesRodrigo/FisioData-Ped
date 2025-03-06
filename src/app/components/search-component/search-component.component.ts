import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search-component.component.html',
  styleUrl: './search-component.component.css'
})
export class SearchComponentComponent implements OnInit {
  @Output() search = new EventEmitter<any>();
  @Output() searchAll = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>();

  @Input() hideButton: boolean = false;

  filterForm: FormGroup

  constructor(
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      department: [''],
      dischargeStatus: [''],
      internacaoStart: [''],
      internacaoEnd: ['']
    });
  }
  ngOnInit(): void {
  }

  onSearch(): void {
    this.search.emit(this.filterForm.value)
  }

  onClear(): void {
    this.clear.emit();
    this.filterForm.reset();
  }

  showAll(): void{
    this.searchAll.emit()
  }
}

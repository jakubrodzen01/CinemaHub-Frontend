import { Component, OnInit } from '@angular/core';
import { AdvertsService } from '../../core/services/adverts.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.component.html',
  styleUrls: ['./adverts.component.css']
})
export class AdvertsComponent implements OnInit {
  adverts: any[] = [];
  role: string | null = localStorage.getItem('role');
  showModal: boolean = false;
  showConfirmModal: boolean = false;
  selectedAdvertId: string | null = null;

  newAdvert = {
    title: '',
    text: ''
  };

  constructor(private advertService: AdvertsService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAdverts();
  }

  loadAdverts() {
    this.advertService.getAll().subscribe(
      (adverts: any) => {
        this.adverts = adverts;
      },
      (error: any) => {
        console.error('Error loading adverts:', error);
      }
    );
  }

  openConfirmModal(id: string) {
    this.selectedAdvertId = id;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.selectedAdvertId = null;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  clearNewAdvert() {
    this.newAdvert = {
      title: '',
      text: ''
    };
  }

  addAdvert() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      this.http.post('http://localhost:8080/api/v1/adverts/add', this.newAdvert, { headers }).subscribe(
        () => {
          this.loadAdverts();
          this.closeModal();
          this.clearNewAdvert();
        },
        error => {
          console.error('Error adding advert:', error);
        }
      );
    }
  }

  deleteAdvert() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      this.http.delete(`http://localhost:8080/api/v1/adverts/delete/${this.selectedAdvertId}`, { headers }).subscribe(
        () => {
          this.loadAdverts();
          this.closeConfirmModal();
        },
        (error: any) => {
          console.error('Error deleting advert:', error);
        }
      );
    }
  }
}

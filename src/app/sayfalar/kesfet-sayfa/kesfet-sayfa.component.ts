import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Soru} from '../../modeller/soru';
import {FirebaseServisService} from '../../servisler/firebaseServis.service';
import {Router} from '@angular/router';
import {AuthService} from '../../servisler/auth.service';

@Component({
  selector: 'app-kesfet-sayfa',
  templateUrl: './kesfet-sayfa.component.html',
  styleUrls: ['./kesfet-sayfa.component.css']
})
export class KesfetSayfaComponent implements OnInit {
  sorular: Observable<Soru[]>;

  constructor(public fbServis: FirebaseServisService, public router: Router, public authServis: AuthService) {
  }

  ngOnInit(): void {
    this.sorular = this.fbServis.SoruListele()
  }

  CevapSil(cevapId: string) {
    if (confirm('Emin misiniz?')) {
      return this.fbServis.CevapSil(cevapId)
    }
  }

}

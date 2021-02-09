import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Soru} from '../../modeller/soru';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../../servisler/auth.service';
import {Router} from '@angular/router';
import {FirebaseServisService} from '../../servisler/firebaseServis.service';

@Component({
  selector: 'app-sorularim-sayfa',
  templateUrl: './sorularim-sayfa.component.html',
  styleUrls: ['./sorularim-sayfa.component.css']
})
export class SorularimSayfaComponent implements OnInit {
  sorularim: Observable<Soru[]>;

  constructor(public db: AngularFireDatabase, public authServis: AuthService, public router: Router, public fbServis: FirebaseServisService) {
  }

  ngOnInit(): void {
    this.sorularim = this.fbServis.SorularimiListele(this.authServis.kullanici.uid);
  }

  SorumuSil(soruId: string) {
    if (confirm('Emin misiniz?')) {
      return this.fbServis.SoruSil(soruId);
    }
  }

  CevabiSil(cevapId: string) {
    if (confirm('Emin misiniz?')) {
      return this.fbServis.CevapSil(cevapId);
    }
  }

}

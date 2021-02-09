import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {Cevap} from '../../modeller/cevap';
import {Soru} from '../../modeller/soru';
import {AuthService} from '../../servisler/auth.service';
import {ActivatedRoute} from '@angular/router';
import {FirebaseServisService} from '../../servisler/firebaseServis.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-soru-detay-sayfa',
  templateUrl: './soru-detay-sayfa.component.html',
  styleUrls: ['./soru-detay-sayfa.component.css']
})
export class SoruDetaySayfaComponent implements OnInit {
  soruRef: AngularFireObject<Soru>;
  soru: Soru = new Soru();

  constructor(
    public authServis: AuthService,
    public db: AngularFireDatabase,
    public route: ActivatedRoute,
    public fbServis: FirebaseServisService,
  ) {
  }

  ngOnInit(): void {
    this.fbServis.SoruGetir(this.route.snapshot.paramMap.get('id')).subscribe(
      soru => {this.soru = soru;}
    );

  }

  CevabimiSil(cevapId: string) {
    if (confirm('Emin misiniz?')) {
      return this.fbServis.CevapSil(cevapId);
    }
  }

}

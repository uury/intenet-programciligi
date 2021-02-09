import {Component, OnInit} from '@angular/core';
import {AngularFireObject} from '@angular/fire/database';
import {Soru} from '../../modeller/soru';
import {ActivatedRoute, Router} from '@angular/router';
import {Kategori} from '../../modeller/kategori';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FirebaseServisService} from '../../servisler/firebaseServis.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-soru-duzenle-sayfa',
  templateUrl: './soru-duzenle-sayfa.component.html',
  styleUrls: ['./soru-duzenle-sayfa.component.css']
})
export class SoruDuzenleSayfaComponent implements OnInit {
  soruRef: AngularFireObject<Soru>;
  soru: Soru = new Soru();
  icerik: string = '';
  kategoriId: string = '';
  kategoriler: Observable<Kategori[]>;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public fbServis: FirebaseServisService,
    public toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.fbServis.SoruGetir(this.route.snapshot.paramMap.get('id')).subscribe(soru => {
      this.soru = soru
      this.icerik = soru.icerik;
      this.kategoriId = soru.kategoriId;
    });

    this.kategoriler = this.fbServis.KategoriListele().pipe(map(changes => {
      return changes.map(c => {
        return {
          id: c.key,
          ...c.payload.val()
        };
      });
    }));
  }

  SoruDuzenle() {
    if (!this.icerik || !this.kategoriId) {
      return this.toastr.error("Alanları Doldurunuz");
    }

    this.fbServis.SoruGuncelle(this.soru.id, this.icerik, this.kategoriId).then(() => {
      this.router.navigate(['kesfet', this.soru.id]);
    });
  }

}

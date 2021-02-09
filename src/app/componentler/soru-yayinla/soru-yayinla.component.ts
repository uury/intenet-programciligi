import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../../servisler/auth.service';
import {Observable} from 'rxjs';
import {Kategori} from '../../modeller/kategori';
import {map} from 'rxjs/operators';
import {FirebaseServisService} from '../../servisler/firebaseServis.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-soru-yayinla',
  templateUrl: './soru-yayinla.component.html',
  styleUrls: ['./soru-yayinla.component.css']
})
export class SoruYayinlaComponent implements OnInit {
  soru: string = '';
  resim: File;
  kategoriId: string = '';
  kategoriler: Observable<Kategori[]>;

  constructor(
    public db: AngularFireDatabase,
    public authServis: AuthService,
    public fbServis: FirebaseServisService,
    public toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.kategoriler = this.fbServis.KategoriListele().pipe(map(changes => {
      return changes.map(c => {
        return {
          id: c.key,
          ...c.payload.val()
        };
      });
    }));
  }

  ResmiAl(resimler: FileList) {
    this.resim = resimler.item(0)
  }

  SoruYayinla() {
    if (!this.soru || !this.kategoriId || !this.resim) {
      return this.toastr.error("Alanları Doldurunuz")
    }

    this.fbServis.SoruOlustur(this.soru, this.authServis.kullanici.uid, this.kategoriId, this.resim)
    this.soru = '';
  }

}

import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {Kategori} from '../../modeller/kategori';
import {Router} from '@angular/router';
import {AuthService} from '../../servisler/auth.service';
import {Kullanici} from '../../modeller/kullanici';
import {map} from 'rxjs/operators';
import {Soru} from '../../modeller/soru';
import {FirebaseServisService} from '../../servisler/firebaseServis.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-admin-sayfa',
  templateUrl: './admin-sayfa.component.html',
  styleUrls: ['./admin-sayfa.component.css']
})
export class AdminSayfaComponent implements OnInit {
  public kategori: string;
  kategoriler: Observable<Kategori[]>;
  sorular: Observable<Soru[]>;

  suankiKategori: Kategori = new Kategori();

  constructor(
    public db: AngularFireDatabase,
    public authServis: AuthService,
    public router: Router,
    public fbServis: FirebaseServisService,
    public toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.db.list<Kullanici>('uye', ref => ref.orderByChild('kullaniciId').equalTo(this.authServis.kullanici.uid)).snapshotChanges().subscribe(changes => {
      const uye = changes[0].payload.val() as Kullanici;

      if (uye.rol !== 'admin') {
        this.router.navigate(['kesfet']);
      }
    });

    this.kategoriler = this.fbServis.KategoriListele().pipe(map(changes => {
      return changes.map(c => {
        return {
          id: c.key,
          ...c.payload.val()
        };
      });
    }));

    this.sorular = this.fbServis.SoruListele();
  }

  KategoriOlustur() {
    if (!this.kategori) return this.toastr.error("Alanları Doldurunuz");

    this.fbServis.KategoriOlustur(this.kategori);
  }

  KategoriSil(id: string) {
    if (confirm('Emin misiniz?')) {
      return this.fbServis.KategoriSil(id);
    }

  }

  GuncellenecekKategori(kategori: Kategori) {
    this.suankiKategori = {...kategori};
  }

  GuncellencekKategoriyiGuncelle() {
    if (!this.suankiKategori.adi) {
      return this.toastr.error('Alanları Doldurunuz');
    }

    return this.fbServis.KategoriGuncelle(this.suankiKategori.id, this.suankiKategori.adi);
  }

  SoruSil(soruId: string) {
    if (confirm('Emin misiniz?')) {
      return this.fbServis.SoruSil(soruId);
    }
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {AngularFireList} from '@angular/fire/database';
import {AuthService} from '../../servisler/auth.service';
import {Cevap} from '../../modeller/cevap';
import {FirebaseServisService} from '../../servisler/firebaseServis.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-cevap-yayinla',
  templateUrl: './cevap-yayinla.component.html',
  styleUrls: ['./cevap-yayinla.component.css']
})
export class CevapYayinlaComponent implements OnInit {
  cevap: string = '';
  @Input('soruId') soruId: string = '';

  cevaplarRef: AngularFireList<Cevap>;

  constructor(
    public authServis: AuthService,
    public fbServis: FirebaseServisService,
    public toastr: ToastrService
  ) {
  }

  ngOnInit(): void {

  }

  CevapEkle() {
    if (!this.cevap) {
      return this.toastr.error("Alanları Doldurunuz")
    }

    this.fbServis.CevapOlustur(this.cevap, this.authServis.kullanici.uid, this.soruId);

    this.cevap = '';
  }

  Begen() {
    return this.fbServis.BegeniOlustur(this.authServis.kullanici.uid, this.soruId);
  }
}

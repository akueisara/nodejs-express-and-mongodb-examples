import { Injectable } from '@angular/core';
import { Favorite, FavDish } from '../shared/favorite';
import { FavoriteExists } from '../shared/favoriteExists';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  userId: string = undefined;
  username: string = undefined;

  constructor( private afs: AngularFirestore,
    private authService: AuthService ) {
    this.authService.getAuthState()
    .subscribe((user) => {
      if (user) {
        // User is signed in.
        this.userId = user.uid;
        this.username = user.email;
      } else {
        this.userId = undefined;
      }
    });
  }

  getFavorites(): Observable<FavDish[]> {
    if (this.userId) {
      return this.afs.collection<FavDish>('favorites', ref => ref.where('user', '==', this.userId)).valueChanges();
    } else {
      return Observable.throw(new Error('No User Logged In!'));
    }
  }
/*
  postFavorites(dishids: any) {
    return this.http.post(baseURL + 'favorites/', dishids)
    .catch(error => { return this.processHTTPMsgService.handleError(error); });
  } */

  isFavorite(id: string): Promise<boolean> {
    const db = firebase.firestore();
    if (this.userId) {
      return db.collection('favorites').where('user', '==', this.userId).where('dish', '==', id).get()
      .then(doc => {
        return !doc.empty;
      });
    } else {
      return Promise.resolve(false);
    }
  }

  postFavorite(id: string) {
    if (this.userId) {
      return this.afs.collection('favorites').add({user: this.userId, dish: id });
    } else {
      return Promise.reject(new Error('No User Logged In!'));
    }
  }

  deleteFavorite(id: string): Promise<void> {
    const db = firebase.firestore();
    if (this.userId) {
      return db.collection('favorites').where('user', '==', this.userId).where('dish', '==', id).get()
      .then(doc => {
        doc.forEach( docu => {
          return db.doc('favorites/' + docu.id).delete();
        });
      });
    } else {
      return Promise.reject(new Error('No User Logged In!'));
    }
  }
}

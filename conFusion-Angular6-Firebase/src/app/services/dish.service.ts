import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private currentUser: firebase.User = null;

  constructor(private afs: AngularFirestore,
    private authService: AuthService ) {
      this.authService.getAuthState()
      .subscribe((user) => {
        if (user) {
          // User is signed in.
          this.currentUser = user;
        } else {
          this.currentUser = null;
        }
      });
  }

  getDishes(): Observable<Dish[]> {
    return this.afs.collection<Dish>('dishes').snapshotChanges()
    .pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Dish;
        const _id = action.payload.doc.id;
        return { _id, ...data };
      });
    }));
  }

  getDish(id: string): Observable<Dish> {
    return this.afs.doc<Dish>('dishes/' + id).snapshotChanges()
    .pipe(map(action => {
        const data = action.payload.data() as Dish;
        const _id = action.payload.id;
        return { _id, ...data };
      }));
  }

  getFeaturedDish(): Observable<Dish> {
    return this.afs.collection<Dish>('dishes', ref => ref.where('featured', '==', true)).snapshotChanges()
    .pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Dish;
        const _id = action.payload.doc.id;
        return { _id, ...data };
      })[0];
    }));
  }

  getDishIds(): Observable<String[] | any> {
    return this.getDishes()
      .pipe(map(dishes => dishes.map(dish => dish._id)))
      .pipe(catchError(error => error ));
  }

  postComment(dishId: string, comment: any): Promise<any> {
    if (this.currentUser) {
      return this.afs.collection('dishes').doc(dishId).collection('comments')
        .add({
          author: {
            '_id': this.currentUser.uid,
            'firstname' : this.currentUser.displayName ? this.currentUser.displayName : this.currentUser.email
          },
          rating: comment.rating,
          comment: comment.comment,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } else {
      return Promise.reject(new Error('No User Logged In!'));
    }
  }

  getComments(dishId: string): Observable<any> {
    return this.afs.collection('dishes').doc(dishId).collection('comments').valueChanges();
  }
}

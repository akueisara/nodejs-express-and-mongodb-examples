import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private afs: AngularFirestore) { }

  getLeaders(): Observable<Leader[]> {
    return this.afs.collection<Leader>('leaders').snapshotChanges()
    .pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Leader;
        const _id = action.payload.doc.id;
        return { _id, ...data };
      });
    }));
  }

  getLeader(id: string): Observable<Leader> {
    return this.afs.doc<Leader>('leaders/' + id).snapshotChanges()
    .pipe(map(action => {
        const data = action.payload.data() as Leader;
        const _id = action.payload.id;
        return { _id, ...data };
      }));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.afs.collection<Leader>('leaders', ref => ref.where('featured', '==', true)).snapshotChanges()
    .pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Leader;
        const _id = action.payload.doc.id;
        return { _id, ...data };
      })[0];
    }));
  }
}

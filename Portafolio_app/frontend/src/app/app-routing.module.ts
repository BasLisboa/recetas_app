import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { RecetaCompartidaPage } from './features/RecetaCompartida/pages/receta-compartida.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  /*{
    path: 'home',
    loadComponent: () =>
      import('./features/home/pages/home.component')
        .then(m => m.HomeComponent),
    children: [
    {
      path: 'detalle_receta/:id',
      loadChildren: () =>
        import('./features/detalle_receta/detalle_receta.module')
          .then(m => m.DetalleRecetaModule)
    }
    ]
  },*/
  {
    path: 'home',
    // En lugar de loadComponent, lazy-load HomeModule completo:
    loadChildren: () =>
      import('./features/home/home.module')
        .then(m => m.HomeModule),
    canActivate: [authGuard]  // opcional: si deseas proteger la sección /home
  },
  {
    path: 'auth',
    children: [
      { path: 'login', loadChildren: () => import('./features/auth/login/login.module').then(m => m.LoginPageModule) },
      { path: 'registrar', loadChildren: () => import('./features/auth/registrar/registrar.module').then(m => m.RegistrarPageModule) },
    ]
  },
  {
    path: 'tab',
    //canActivate: [authGuard],
    loadChildren: () => import('./layout/tab-menu/tab-menu.module').then(m => m.TabMenuModule),
  },
  {
    path: 'mis',
    //canActivate: [authGuard],
    loadChildren: () => import('./features/mis_recetas/mis.module').then( m => m.MisPageModule)
  },
  {
    path: 'receta-compartida',
    loadChildren: () =>
      import('./features/RecetaCompartida/pages/receta-compartida.module')
        .then(m => m.RecetaCompartidaPageModule)
  },

  {
    path: 'perfil',
    //canActivate: [authGuard],
    loadChildren: () => import('./features/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  /*{
    path: 'detalle_receta/:id',
    loadChildren: () =>
      import('./features/detalle_receta/detalle_receta.module')
        .then(m => m.DetalleRecetaModule)
  },*/
  // fallback 404
  { path: '**', redirectTo: 'home' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update_filter } from '../searchOld';
import { NavigationBar } from './NavigationBar';

interface Props {}

export const NavigationBarController: FC<Props> = () => {
  const dispatch = useDispatch();
  const { filter_subscribe, router } = useSelector((state: any) => ({
    filter_subscribe: state.filter_subscribe,
    router: state.router,
  }));

  const update = (text: string) =>
    update_filter(text, filter_subscribe, router.location, dispatch);

  const qs = new URLSearchParams(router.location.search);

  return <NavigationBar query={qs.get('s') || ''} setQuery={update} />;
};

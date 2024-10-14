import { useState, useEffect, useCallback } from 'react';
import { ActivityMapResponse } from '../api/types';
import ActivityService from '../services/activity.service';

const emptyMapResponse: ActivityMapResponse = {
  id: 0,
  tasks: [],
  mapSizeX: 0,
  mapSizeY: 0,
  image: null
};

export const useActivities = (selectedChapterId: number) => {
  const [activities, setActivities] = useState<ActivityMapResponse>(emptyMapResponse);

  const getActivities = useCallback(() => {
    ActivityService.getActivityMap(selectedChapterId)
      .then((response) => {
        setActivities(response);
      })
      .catch(() => {
        setActivities(emptyMapResponse);
      });
  }, [selectedChapterId]);

  useEffect(() => {
    getActivities();
  }, [getActivities]);

  return activities;
};
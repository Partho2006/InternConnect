import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { ExclamationTriangleIcon, SparklesIcon } from '@heroicons/react/24/outline';

const SubscriptionBanner = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await axios.get('/subscription/me');
      setSubscription(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading || !subscription) return null;

  const isNearLimit = subscription.plan === 'free' && (
    subscription.dailyApplications >= subscription.maxDailyApplications - 2 ||
    subscription.dailyPosts >= subscription.maxDailyPosts
  );

  if (!isNearLimit && subscription.plan !== 'free') return null;

  return (
    <div className={`${
      subscription.plan === 'free' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
    } border-b px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {subscription.plan === 'free' ? (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
          ) : (
            <SparklesIcon className="h-5 w-5 text-blue-600" />
          )}
          <p className="text-sm font-medium text-gray-900">
            {subscription.plan === 'free' ? (
              <>
                You're on the Free plan. 
                {subscription.dailyApplications > 0 && ` ${subscription.dailyApplications}/${subscription.maxDailyApplications} applications used today.`}
                {subscription.dailyPosts > 0 && ` ${subscription.dailyPosts}/${subscription.maxDailyPosts} posts used today.`}
              </>
            ) : (
              `You're on the ${subscription.plan} plan with enhanced limits!`
            )}
          </p>
        </div>
        <a
          href="#pricing"
          className="text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          Upgrade →
        </a>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
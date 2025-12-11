from django.core.cache import caches

analytics_cache = caches['analytics']


def cached_analytics(key, compute_fn, timeout=300):
    """
    Generic helper for caching analytics computations.
    compute_fn is a callable returning any JSON-serializable data.
    """
    data = analytics_cache.get(key)
    if data is not None:
        return data

    data = compute_fn()
    analytics_cache.set(key, data, timeout)
    return data

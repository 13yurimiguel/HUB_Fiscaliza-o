import '../models/activity.dart';
import '../models/worksite.dart';
import '../services/sync_service.dart';

class WorksiteRepository {
  WorksiteRepository({SyncService? syncService}) : _syncService = syncService ?? SyncService();

  final SyncService _syncService;

  Future<List<Worksite>> fetchWorksites() => _syncService.getCachedWorksites();

  Future<List<Activity>> fetchActivities(String worksiteId) async {
    final activities = await _syncService.getCachedActivities();
    return activities.where((activity) => activity.worksiteId == worksiteId).toList();
  }
}

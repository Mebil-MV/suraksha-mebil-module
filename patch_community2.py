import codecs
import re

file_path = 'frontend/src/pages/CommunityPage.tsx'

with codecs.open(file_path, 'r', 'utf-8') as f:
    content = f.read()

# Add handleResolve and handleEscalate functions
functions_block = """  const handleAssign = async (requestId: number, volunteerId: string) => {
    if (!volunteerId) return;
    try {
      await apiPatch(`/community/help-requests/${requestId}/assign`, {
        volunteer_id: parseInt(volunteerId)
      });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };"""

new_functions_block = functions_block + """

  const handleResolve = async (requestId: number) => {
    try {
      await apiPatch(`/community/help-requests/${requestId}/status`, {
        status: 'resolved'
      });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEscalate = async (requestId: number) => {
    try {
      await apiPatch(`/community/help-requests/${requestId}/escalate`, {});
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };"""

content = content.replace(functions_block, new_functions_block)

# Add the UI buttons if hr.user_id === username
hr_block_old = """              <div className="flex-between" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                <span>{hr.user_id} • {hr.status}</span>
                {hr.assigned_volunteer_id ? (
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>Assigned to Vol #{hr.assigned_volunteer_id}</span>
                ) : (
                  <select 
                    title={t('community.assign_volunteer')}
                    onChange={(e) => handleAssign(hr.id, e.target.value)}
                    style={{ padding: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="">{t('community.assign_volunteer')}...</option>
                    {volunteers.map(v => (
                      <option key={v.id} value={v.id}>{v.full_name} ({v.skills.join(', ')})</option>
                    ))}
                  </select>
                )}
              </div>
            </div>"""

hr_block_new = """              <div className="flex-between" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                <span>{hr.user_id} • {hr.status}</span>
                {hr.assigned_volunteer_id ? (
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>Assigned to Vol #{hr.assigned_volunteer_id}</span>
                ) : (
                  <select 
                    title={t('community.assign_volunteer')}
                    onChange={(e) => handleAssign(hr.id, e.target.value)}
                    style={{ padding: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="">{t('community.assign_volunteer')}...</option>
                    {volunteers.map(v => (
                      <option key={v.id} value={v.id}>{v.full_name} ({v.skills.join(', ')})</option>
                    ))}
                  </select>
                )}
              </div>
              {hr.user_id === username && hr.status !== 'resolved' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleResolve(hr.id)} className="btn btn-sm btn-outline" style={{ borderColor: '#10b981', color: '#10b981', flex: 1 }}>
                    ✅ {t('community.im_okay')}
                  </button>
                  <button onClick={() => handleEscalate(hr.id)} className="btn btn-sm btn-danger" style={{ flex: 1 }}>
                    🚨 {t('community.still_in_danger')}
                  </button>
                </div>
              )}
            </div>"""

content = content.replace(hr_block_old, hr_block_new)

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(content)

print("CommunityPage updated")

import { useState, useEffect } from 'react';
import userService from '../services/user.service';
import GroupService from '../services/group.service';

export const useStudentsOfSubgroup = (courseId: number) => {
  const [studentsOfSubgroup, setStudentsOfSubgroup] = useState<any[]>([]);

  useEffect(() => {
    let userGroup = -1;
    let userSubgroup = -1;

    // console.log(`Fetching user group ID for courseId: ${courseId}`);
    userService.getUserGroupId(courseId)
      .then((response) => {
        userGroup = response;
        // console.log(`Fetched user group ID: ${userGroup}`);

        // console.log(`Fetching user subgroup ID for courseId: ${courseId}`);
        userService.getUserSubgroupId(courseId)
          .then((response) => {
            userSubgroup = response;
            // console.log(`Fetched user subgroup ID: ${userSubgroup}`);

            // console.log(`Fetching students for userGroup: ${userGroup}, userSubgroup: ${userSubgroup}`);
            GroupService.getSubgroupStudentsExtended(userGroup, userSubgroup)
              .then((response) => {
                const studentsOfSubgroupResponse = response?.map((student: any) => ({ ...student }));
                // console.log(`Fetched students: ${JSON.stringify(studentsOfSubgroupResponse)}`);

                let studentsOfSubgroup_local = [];
                let count = 0;
                for (let student of studentsOfSubgroupResponse) {
                  if (count === 4) break;
                  let entry = {
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    subgroup: student.subgroup == null ? 0 : student.subgroup,
                    role: student.role
                  };

                  studentsOfSubgroup_local.push(entry);
                  count++;
                }
                // console.log(`Processed students: ${JSON.stringify(studentsOfSubgroup_local)}`);
                setStudentsOfSubgroup(studentsOfSubgroup_local);
              })
              .catch((error) => {
                console.error(`Error fetching students: ${error}`);
                setStudentsOfSubgroup([]);
              });
          })
          .catch((error) => {
            console.error(`Error fetching user subgroup ID: ${error}`);
          });
      })
      .catch((error) => {
        console.error(`Error fetching user group ID: ${error}`);
      });
  }, [courseId]);

  return [studentsOfSubgroup, setStudentsOfSubgroup] as const;
};
import React from 'react'
import LSIT from './LSIT'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Login';
import Dashboard from './student/Dashboard';
import CourseRegistration from './student/CourseRegistration';
import Registration from './student/Registration';
import RegisteredCourses from './student/RegisteredCourses';
import IdCard from './student/IdCard';
import Grades from './student/Grades';
import Jobs from './student/Jobs';
import Services from './student/Services';
import LMS from './student/LMS';
import Chatbox from './student/Chatbox';
import Profile from './student/Profile';
import Fee from './student/Fee';
import Logout from './student/Logout';
import Admin from './Admin';
import Board from './Admin/Board';
import Courses from './Admin/Courses';
import CourseList from './Admin/CourseList';
import AcademicService from './Admin/AcademicService';
import Studentservices from './Admin/Studentservices';
import StudentInfo from './Admin/StudentInfo';
import AdminProfile from './Admin/AdminProfile';
import StudentRecord from './Admin/StudentRecord';
import UpdateStudent from './Admin/UpdateStudent';
import UploadGrades from './Admin/UploadGrades';
import StaffInfo from './Admin/StaffInfo';
import UpdateStaff from './Admin/UpdateStaff';
import UpdateStaffDetail from './Admin/UpdateStaffDetail';
import AssignCourses from './Admin/AssignCourses';
import OfferAttendance from './Admin/OfferAttendance';
import FeeStructure from './Admin/FeeStructure';
import Lms from './Admin/Lms';
import AddLibrary from './Admin/AddLibrary';
import UploadJob from './Admin/UploadJob';
import JobList from './Admin/JobList';
import CreateIdCard from './Admin/CreateIdCard';
import AdminChatbox from './Admin/AdminChatbox';
import Staff from './Staff';
import StaffBoard from './Staff/StaffBoard';
import JobsListing from './Staff/JobsListing';
import StaffProfile from './Staff/StaffProfile';
import AlumniDB from './Alumni/AlumniDB';
import AlumniGrades from './Alumni/AlumniGrades';
import Alumniservices from './Alumni/Alumniservices';
import AlumniProfile from './Alumni/AlumniProfile';
import AlumniChatbox from './Alumni/AlumniChatbox';
import StaffCourse from './Staff/StaffCourse';
import StudentAttendance from './Staff/StudentAttendance';
import BookList from './Admin/BookList';
import StudentPDFViewer from './student/StudentPDFViewer';
import Library from './student/Library';
import Issue from './student/Issue';
import Approval from './Admin/Approval';
import StudentList from './Admin/StudentList';
import BookApproval from './Admin/BookApproval';
  const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="LSIT" >
    <Stack.Screen name="LSIT" component={LSIT}></Stack.Screen>
    <Stack.Screen name="Login" component={Login}></Stack.Screen>
    <Stack.Screen name="Dashboard" component={Dashboard}></Stack.Screen>
    <Stack.Screen name="CourseRegistration" component={CourseRegistration}></Stack.Screen>
    <Stack.Screen name="Registration" component={Registration}></Stack.Screen>
    <Stack.Screen name="RegisteredCourses" component={RegisteredCourses}></Stack.Screen>
    <Stack.Screen name="IdCard" component={IdCard}></Stack.Screen>
    <Stack.Screen name="Grades" component={Grades}></Stack.Screen>
    <Stack.Screen name="Services" component={Services}></Stack.Screen>
    <Stack.Screen name="Jobs" component={Jobs}></Stack.Screen>
    <Stack.Screen name="LMS" component={LMS}></Stack.Screen>
    <Stack.Screen name="Chatbox" component={Chatbox}></Stack.Screen>
    <Stack.Screen name="Fee" component={Fee}></Stack.Screen>
    <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
    <Stack.Screen name="Admin" component={Admin}></Stack.Screen>
    <Stack.Screen name="Board" component={Board}></Stack.Screen>
    <Stack.Screen name="Courses" component={Courses}></Stack.Screen>
    <Stack.Screen name="CourseList" component={CourseList}></Stack.Screen>
    <Stack.Screen name="AcademicService" component={AcademicService}></Stack.Screen>
    <Stack.Screen name="Studentservices" component={Studentservices}></Stack.Screen>
    <Stack.Screen name="StudentInfo" component={StudentInfo}></Stack.Screen>
    <Stack.Screen name="AdminProfile" component={AdminProfile}></Stack.Screen>
    <Stack.Screen name="StudentRecord" component={StudentRecord}></Stack.Screen>
    <Stack.Screen name="UpdateStudent" component={UpdateStudent}></Stack.Screen>
    <Stack.Screen name="UploadGrades" component={UploadGrades}></Stack.Screen>
    <Stack.Screen name="StaffInfo" component={StaffInfo}></Stack.Screen>
    <Stack.Screen name="UpdateStaff" component={UpdateStaff}></Stack.Screen>
    <Stack.Screen name="UpdateStaffDetail" component={UpdateStaffDetail}></Stack.Screen>
    <Stack.Screen name="AssignCourses" component={AssignCourses}></Stack.Screen>
    <Stack.Screen name="OfferAttendance" component={OfferAttendance}></Stack.Screen>
    <Stack.Screen name="FeeStructure" component={FeeStructure}></Stack.Screen>
    <Stack.Screen name="Lms" component={Lms}></Stack.Screen>
    <Stack.Screen name="AddLibrary" component={AddLibrary}></Stack.Screen>
    <Stack.Screen name="UploadJob" component={UploadJob}></Stack.Screen>
    <Stack.Screen name="JobList" component={JobList}></Stack.Screen>
    <Stack.Screen name="CreateIdCard" component={CreateIdCard}></Stack.Screen>
    <Stack.Screen name="AdminChatbox" component={AdminChatbox}></Stack.Screen>
    <Stack.Screen name="Staff" component={Staff}></Stack.Screen>
    <Stack.Screen name="StaffBoard" component={StaffBoard}></Stack.Screen>
    <Stack.Screen name="JobsListing" component={JobsListing}></Stack.Screen>
    <Stack.Screen name="StaffProfile" component={StaffProfile}></Stack.Screen>
    <Stack.Screen name="AlumniDB" component={AlumniDB}></Stack.Screen>
    <Stack.Screen name="AlumniGrades" component={AlumniGrades}></Stack.Screen>
    <Stack.Screen name="Alumniservices" component={Alumniservices}></Stack.Screen>
    <Stack.Screen name="AlumniProfile" component={AlumniProfile}></Stack.Screen>
    <Stack.Screen name="AlumniChatbox" component={AlumniChatbox}></Stack.Screen>
    <Stack.Screen name="StaffCourse" component={StaffCourse}></Stack.Screen>
    <Stack.Screen name="StudentAttendance" component={StudentAttendance}></Stack.Screen>
    <Stack.Screen name="BookList" component={BookList}></Stack.Screen>
   <Stack.Screen name="StudentPDFViewer" component={StudentPDFViewer}></Stack.Screen>
    <Stack.Screen name="Library" component={Library}></Stack.Screen>
    <Stack.Screen name="Issue" component={Issue}></Stack.Screen>
    <Stack.Screen name="Approval" component={Approval}></Stack.Screen>
    <Stack.Screen name="StudentList" component={StudentList}></Stack.Screen>
    <Stack.Screen name="BookApproval" component={BookApproval}></Stack.Screen>
    </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App